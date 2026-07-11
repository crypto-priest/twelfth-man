"use client";

import dynamic from "next/dynamic";
import { EmptyState } from "./empty-state";

const WalletButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false }
);

export function ConnectPrompt({ body }: { body: string }) {
  return (
    <EmptyState icon="🎫" title="Ticket check" body={body}>
      <div className="mt-2">
        <WalletButton />
      </div>
    </EmptyState>
  );
}
