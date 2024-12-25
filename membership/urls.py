from django.urls import path, re_path
from membership import views
from membership.views import LoginView,ValidateTokenView

urlpatterns = [
    path("", views.index, name="index"),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/validate-token/', ValidateTokenView.as_view(), name='validate-token'),
    path("api/<int:member_id>/", views.detail, name="detail"),
    path("api/<int:member_id>/data", views.detail_json, name="details_json"),
    path("api/membership_counts/", views.membership_counts, name="membership_counts"),
    re_path(r"^api/ng_test$", views.member_list),
    path("api/data", views.pivot_data, name="pivot_data"),
]
