from django.shortcuts import get_object_or_404, render
from django.http import JsonResponse
from rest_framework import viewsets
from membership.serializers import MemberSerializer
from membership.models import Member
#import json
from django.core import serializers


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


def dashboard_with_pivot(request):
    return render(request, "dashboard_with_pivot.html", {})


def pivot_data(request):
    #dataset = MemberSerializer(Member.objects.all(), many=True)
    #return JsonResponse(json.loads(json.dumps(dataset.data)), safe=False)
    dataset = Member.objects.all()
    data = serializers.serialize("json", dataset)
    return JsonResponse(data, safe=False)


class MemberView(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    queryset = Member.objects.all()
