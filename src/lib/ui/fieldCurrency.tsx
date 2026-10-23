import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const boxClass =
  "rounded-2xl border border-white/10 bg-black/20 p-4 transition-colors hover:border-primary/30";

type AmountBoxProps = {
  label: string;
  amount: React.ReactNode;
  tokenName: string;
  balance: string;
  readOnly?: boolean;
};

export const AmountBox = ({
  label,
  amount,
  tokenName,
  balance,
  readOnly = false,
}: AmountBoxProps) => {
  return (
    <div className={boxClass}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          {readOnly ? (
            <div className="mt-1 truncate text-2xl font-semibold tracking-tight">
              {amount}
            </div>
          ) : (
            amount
          )}
          <p className="mt-1 text-xs text-muted-foreground">wei</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Badge
            variant="outline"
            className="border-white/10 bg-white/[0.04] px-3 py-1 text-sm font-medium"
          >
            {tokenName}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Balance: {balance}
          </span>
        </div>
      </div>
    </div>
  );
};

export const FieldCurrency = (props: any) => {
  return (
    <AmountBox
      label={props.field === "input" ? "You pay" : "Amount"}
      tokenName={props.tokenName}
      balance={props.balance}
      amount={
        props.loading ? (
          <div className="mt-1 flex h-9 items-center">
            <props.spinner />
          </div>
        ) : (
          <input
            type="text"
            inputMode="decimal"
            className={cn(
              "mt-1 w-full min-w-0 bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/40"
            )}
            placeholder="0"
            value={props.value}
            onChange={(e) => props.onAmount(e.target.value)}
          />
        )
      }
    />
  );
};
