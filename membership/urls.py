from django.urls import path, re_path

from membership import views
from membership.views import LoginView,ValidateTokenView, ValidateRefreshTokenView
from axes.decorators import axes_dispatch

urlpatterns = [
    path("", views.index, name="index"),
    path('api/login/', axes_dispatch(LoginView.as_view()), name='login'),
    path('api/validate-token/', ValidateTokenView.as_view(), name='validate-token'),
    path('api/validate-refresh-token/', ValidateRefreshTokenView.as_view(), name='validate-refresh-token'),
    path("api/<int:member_id>/data", views.detail_json, name="details_json"),
    path("api/membership_counts/", views.membership_counts, name="membership_counts"),
    path("api/earliest_listdate/", views.earliest_listdate, name="earliest_listdate"),
    path("api/membership-updates/<str:start_date>/<str:end_date>/", views.membership_updates, name="membership_updates"),
    re_path(r"^api/ng_test$", views.member_list),
    path("api/data", views.pivot_data, name="pivot_data"),
]
