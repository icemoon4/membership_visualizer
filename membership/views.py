# import json
from django.core import serializers
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets
from rest_framework.decorators import api_view

from membership.models import Member, MembershipCount
from membership.serializers import MemberSerializer, MembershipCountSerializer


# Create your views here.
def index(request):
    member_list = Member.objects.order_by("list_date")
    context = {
        "member_list": member_list,
    }
    return render(request, "index.html", context)


def detail(request, member_id):
    member = get_object_or_404(Member, pk=member_id)
    return render(request, "detail.html", {"member": member})

def detail_json(request, member_id):
    member = get_object_or_404(Member, pk=member_id)
    members_serializer = MemberSerializer(member, many=False)
    return JsonResponse(members_serializer.data, safe=False)


def dashboard_with_pivot(request):
    return render(request, "dashboard_with_pivot.html", {})


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
