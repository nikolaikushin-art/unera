import { Link } from "@tanstack/react-router";
import type { AnchorHTMLAttributes } from "react";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

/** Internal paths ("/about") use the client router; everything else is a normal anchor. */
export function A({ href, children, ...rest }: Props) {
  if (href.startsWith("/") && !href.startsWith("//")) {
    const [path = "/", hash] = href.split("#");
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Link to={path as any} hash={hash} {...(rest as object)}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
