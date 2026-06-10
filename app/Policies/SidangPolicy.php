<?php

namespace App\Policies;

use App\Models\Sidang;
use App\Models\User;

class SidangPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Sidang $sidang): bool
    {
        return $user->role === 'admin' || $user->id === $sidang->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Sidang $sidang): bool
    {
        return $user->id === $sidang->user_id;
    }

    public function delete(User $user, Sidang $sidang): bool
    {
        return $user->id === $sidang->user_id;
    }
}
