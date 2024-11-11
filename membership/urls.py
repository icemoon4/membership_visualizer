from django.urls import path

from membership import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<int:member_id>/", views.detail, name="detail"),
    # path(r"^api/ng_test$", views.member_list),
    path("dashboard", views.dashboard_with_pivot, name="dashboard_with_pivot"),
    path("data", views.pivot_data, name="pivot_data"),
]
