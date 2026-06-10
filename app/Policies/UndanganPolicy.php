<?php

namespace App\Policies;

use App\Models\Undangan;
use App\Models\User;

class UndanganPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Undangan $undangan): bool
    {
        return $user->role === 'admin' || $user->id === $undangan->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Undangan $undangan): bool
    {
        return $user->id === $undangan->user_id;
    }

    public function delete(User $user, Undangan $undangan): bool
    {
        return $user->id === $undangan->user_id;
    }
}
