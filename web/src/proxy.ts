import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// Vérification optimiste : sans cookie de session, inutile de rendre la page,
// on renvoie tout de suite vers la connexion. Le vrai contrôle (session valide
// et rôle) est fait côté serveur par requireSession / requirePermission.
export function proxy(request: NextRequest) {
  if (!getSessionCookie(request)) {
    const url = new URL("/connexion", request.url);
    url.searchParams.set("retour", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profil/:path*", "/admin/:path*"],
};
