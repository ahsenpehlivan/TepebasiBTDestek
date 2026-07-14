package com.ahsen.tepebasibtdestek.core.ui

import com.ahsen.tepebasibtdestek.domain.auth.AppRole

fun AppRole.toTurkishLabel(): String = when (this) {
    AppRole.Employee -> "Personel"
    AppRole.Technician -> "Teknik Personel"
    AppRole.Admin -> "Yönetici"
}
