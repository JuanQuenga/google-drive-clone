// app/PostHogPageView.tsx
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { useAuth } from "@workos-inc/authkit-nextjs/components";

export default function PostHogPageView(): null {
  const posthog = usePostHog();

  const { user } = useAuth();
  useEffect(() => {
    if (user?.id) {
      posthog.identify(user.id, {
        email: user?.email,
      });
    } else {
      posthog.reset();
    }
  }, [posthog, user]);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Track pageviews
  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }

      posthog.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthog]);

  return null;
}
