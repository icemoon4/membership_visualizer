# import json
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
from membership.serializers import MemberSerializer, MembershipCountSerializer


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
                res = Response()
                res.set_cookie(
                    key='refresh_token',
                    value=str(refresh),
                    httponly=True,
                    secure=True, # Ensure HTTPS
                    samesite='Strict',
                )
                res.data = {
                    "access": str(refresh.access_token),
                }
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