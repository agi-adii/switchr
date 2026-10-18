import React from "react";
import { Link as RouterLink } from "react-router-dom";

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string | { pathname?: string; query?: Record<string, string> };
  children?: React.ReactNode;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
}

export default function Link({ href, children, replace, ...rest }: LinkProps) {
  const to = typeof href === "string" ? href : href.pathname || "/";
  return (
    <RouterLink to={to} replace={replace} {...rest}>
      {children}
    </RouterLink>
  );
}
