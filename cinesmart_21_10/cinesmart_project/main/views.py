# main/views.py

from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from .forms import SignupForm, LoginForm, UserProfileForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required

def home(request):
    signup_form = SignupForm()
    login_form = LoginForm()
    return render(request, 'main/mi.html', {
        'signup_form': signup_form,
        'login_form': login_form,
    })
def signup_view(request):
    if request.method == 'POST':
        signup_form = SignupForm(request.POST, request.FILES)
        login_form = LoginForm()
        if signup_form.is_valid():
            user = signup_form.save()
            login(request, user)
            messages.success(request, 'Signup successful! Welcome, your account has been created.')
            return redirect('home')
        else:
            messages.error(request, 'Signup failed. Please correct the errors below.')
            return render(request, 'main/mi.html', {'signup_form': signup_form, 'login_form': login_form})
    else:
        return redirect('home')

def login_view(request):
    if request.method == 'POST':
        signup_form = SignupForm()
        login_form = LoginForm(data=request.POST)
        if login_form.is_valid():
            user = login_form.get_user()
            login(request, user)
            messages.success(request, 'Login successful! Welcome back.')
            return redirect('home')
        else:
            messages.error(request, 'Login failed. Please check your username and password.')
            return render(request, 'main/mi.html', {'signup_form': signup_form, 'login_form': login_form})
    else:
        return redirect('home')

def logout_view(request):
    logout(request)
    messages.success(request, 'You have been logged out successfully.')
    return redirect('home')

@login_required
def profile_view(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=request.user.userprofile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully.')
            return redirect('profile')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = UserProfileForm(instance=request.user.userprofile)
    return render(request, 'main/profile.html', {'form': form})
