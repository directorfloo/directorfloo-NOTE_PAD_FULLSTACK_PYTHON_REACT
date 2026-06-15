from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def root(request):
    return JsonResponse({"message": "Notes API is running 🚀"})
urlpatterns = [
    path("", root),
    path("admin/", admin.site.urls),
    path("api/auth/", include("apps.auth_app.urls")),
    path("api/notes/", include("apps.notes.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
