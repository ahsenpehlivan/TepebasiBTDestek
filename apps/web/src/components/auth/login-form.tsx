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
          placeholder="Parolanızı girin"
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
          Bu demo panel, önceden tanımlanmış test hesapları ile kullanılır.
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>

      <p className={styles.helper}>
        Kayıt olma ve şifre yenileme adımları bu prototip kapsamında yer almaz.
      </p>
    </form>
  );
}
