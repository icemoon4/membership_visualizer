from django.urls import path, re_path

from membership import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<int:member_id>/", views.detail, name="detail"),
    path("<int:member_id>/data", views.detail_json, name="details_json"),
    path("api/membership_counts/", views.membership_counts, name="membership_counts"),
    re_path(r"^api/ng_test$", views.member_list),
    path("dashboard", views.dashboard_with_pivot, name="dashboard_with_pivot"),
    path("data", views.pivot_data, name="pivot_data"),
]
