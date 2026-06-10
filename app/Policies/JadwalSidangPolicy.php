<?php

namespace App\Policies;

use App\Models\JadwalSidang;
use App\Models\User;

class JadwalSidangPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, JadwalSidang $jadwalSidang): bool
    {
        return $user->role === 'admin' || $user->id === $jadwalSidang->sidang->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, JadwalSidang $jadwalSidang): bool
    {
        return $user->id === $jadwalSidang->sidang->user_id;
    }

    public function delete(User $user, JadwalSidang $jadwalSidang): bool
    {
        return $user->id === $jadwalSidang->sidang->user_id;
    }
}
