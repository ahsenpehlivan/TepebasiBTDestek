"use client";

import { useActionState } from "react";

import { loginAction, type LoginActionState } from "@/app/actions/auth";

import styles from "./login-form.module.css";

const initialLoginActionState: LoginActionState = {
  error: null,
};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialLoginActionState,
  );

  return (
    <form className={styles.form} action={formAction}>
      <label className={styles.field}>
        <span>E-posta</span>
        <input
          type="email"
          name="email"
          placeholder="technician.demo@example.com"
          autoComplete="email"
          required
        />
      </label>

      <label className={styles.field}>
        <span>Parola</span>
        <input
          type="password"
          name="password"
          placeholder="Parolanizi girin"
          autoComplete="current-password"
          required
        />
      </label>

      {state.error ? (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      ) : (
        <p className={styles.helper}>
          Bu web paneli yalnizca onceden tanimlanmis demo hesaplarla kullanilabilir.
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Giris yapiliyor..." : "Giris Yap"}
      </button>

      <p className={styles.helper}>
        Kayit olma, sosyal giris ve sifre sifirlama akislari bu prototip kapsaminda
        degildir.
      </p>
    </form>
  );
}
