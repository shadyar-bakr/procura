"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import { CURRENCY } from "@/lib/constants";

type InvoiceOverviewChartProps = {
  data: {
    month: string;
    paid: number;
    unpaid: number;
  }[];
  className?: string;
};

const chartConfig = {
  paid: { label: "Paid", color: "var(--chart-1)" },
  unpaid: { label: "Unpaid", color: "var(--chart-2)" },
} as const;

export function InvoiceOverviewChart({
  data,
  className,
}: InvoiceOverviewChartProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>Invoice Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pl-2">
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                stroke="#888888"
                fontSize={12}
              />
              <YAxis
                tickFormatter={(value) =>
                  formatCurrency(Number(value), CURRENCY)
                }
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                stroke="#888888"
                fontSize={12}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="paid"
                fill="var(--color-paid)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="unpaid"
                fill="var(--color-unpaid)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">No data to display</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
