# import json
from datetime import datetime

from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .serializers import UserSerializer
from django.core import serializers
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.views.decorators.csrf import ensure_csrf_cookie

from membership.models import Member, MembershipCount
from membership.serializers import (
    MemberSerializer,
    MembershipCountSerializer,
    MemberUpdateTrackerSerializer,
)


# Create your views here.
@ensure_csrf_cookie
def index(request):
    return render(request, "index.html")


def detail_json(request, member_id):
    member = get_object_or_404(Member, pk=member_id)
    members_serializer = MemberSerializer(member, many=False)
    return JsonResponse(members_serializer.data, safe=False)


def pivot_data(request):
    # dataset = MemberSerializer(Member.objects.all(), many=True)
    # return JsonResponse(json.loads(json.dumps(dataset.data)), safe=False)
    dataset = Member.objects.all()
    data = serializers.serialize("json", dataset)
    return JsonResponse(data, safe=False)


class MemberView(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    queryset = Member.objects.all()


@api_view(["GET"])
def membership_counts(request):
    if request.method == "GET":
        counts = MembershipCount.objects.all()
        members_serializer = MembershipCountSerializer(counts, many=True)
        return JsonResponse(members_serializer.data, safe=False)


@api_view(["GET"])
def member_list(request):
    if request.method == "GET":
        members = Member.objects.all()
        id = request.GET.get("actionkit_id")
        if id:
            members = members.filter(actionkit_id__icontains=id)

        members_serializer = MemberSerializer(members, many=True)
        return JsonResponse(members_serializer.data, safe=False)
    return JsonResponse([], safe=False)


def group_data(data: list, key="actionkit_id"):
    sorted_data = {}
    for row in data:
        key_val = row.get(key)
        sorted_data[key_val] = row

    return sorted_data

@api_view(["GET"])
def earliest_listdate(request):
    if request.method == "GET":
        earliest_list_date = Member.history.earliest("list_date").list_date
        latest_list_date = Member.history.latest("list_date").list_date
        return JsonResponse({"earliest_date": earliest_list_date, "latest_date": latest_list_date})


@api_view(["GET"])
def membership_updates(request, start_date: datetime.date, end_date: datetime.date):
    if request.method == "GET":
        if not end_date > start_date:
            raise Exception("Start date must come before end date")
        fields_to_compare = (
            "first_name",
            "middle_name",
            "last_name",
            "email",
            "best_phone",
            "membership_type",
            "monthly_dues_status",
            "yearly_dues_status",
            "membership_status",
        )
        # Get the historical data for the closest list date to the 2 given dates
        list_date_start = (
            Member.history.filter(list_date__gte=start_date)
            .earliest("list_date")
            .list_date
        )
        start_date_members = Member.history.filter(list_date=list_date_start).order_by(
            "first_name", "last_name", "join_date"
        )
        list_date_end = (
            Member.history.filter(list_date__lte=end_date).latest("list_date").list_date
        )
        end_date_members = Member.history.filter(list_date=list_date_end).order_by(
            "first_name", "last_name", "join_date"
        )

        # Serialized data, turn into dicts by actionkit_id so we can easily grab like-rows
        old_data = MemberUpdateTrackerSerializer(start_date_members, many=True).data
        old_data = group_data(old_data)
        new_data = MemberUpdateTrackerSerializer(end_date_members, many=True).data
        new_data = group_data(new_data)

        new_values = {}
        updated_values = {}
        deleted_values = {}

        for ak_id, new_row in new_data.items():
            if ak_id in old_data:
                old_row = old_data.pop(ak_id)  # remove from old list

                for field in fields_to_compare:
                    old_val = old_row.get(field)
                    new_val = new_row.get(field)
                    if (
                        old_val != new_val
                    ):  # if not equal, then they changed. Log the change
                        if ak_id not in updated_values:
                            updated_values[ak_id] = {
                                "current_values": new_row,
                                "updated_values": {},
                            }
                        updated_values[ak_id]["updated_values"][field] = (
                            old_val,
                            new_val,
                        )
            else:
                # if ak_id isnt in old data, it's a new addition
                new_values[ak_id] = new_row

        for ak_id, old_row in old_data.items():
            # any leftover rows were removed from the new file
            deleted_values[ak_id] = old_row

        return JsonResponse({
            "new_values": new_values,
            "updated_values": updated_values,
            "deleted_values": deleted_values,
        })
    return JsonResponse({{},{},{}})


# reffed from here https://dev.to/akdevelop/django-react-login-how-to-setup-a-login-page-5dl8
class LoginView(APIView):
       def post(self, request):
           username = request.data.get('username')
           password = request.data.get('password')
           user = authenticate(request=request, username=username, password=password)
           if not user:
               raise AuthenticationFailed("Invalid credentials")
           if user:
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                res = Response({
                    "access": access_token,
                    "refresh": str(refresh)
                })
                return res
            

class ValidateTokenView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # If the token is valid, return success
        return Response({'message': 'Token is valid'}, status=status.HTTP_200_OK)
    
class ValidateRefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if refresh_token is None:
            return Response({'error': 'No refresh token'}, status=401)
        
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({'access': access_token})
        except TokenError:
            return Response({'error': 'Invalid refresh token'}, status=401)
