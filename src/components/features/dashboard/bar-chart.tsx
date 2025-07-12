"use client";

import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn, formatCurrency } from "@/lib/utils";
import { CURRENCY } from "@/lib/constants";

type BarChartProps = {
  title: string;
  data: {
    name: string;
    total: number;
    fill: string;
  }[];
  config: {
    [key: string]: {
      label: string;
      color: string;
    };
  };
  className?: string;
};

export function BarChart({ title, data, config, className }: BarChartProps) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {data.length > 0 ? (
          <ChartContainer config={config} className="h-full w-full">
            <RechartsBarChart data={data} layout="vertical">
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={5}
                axisLine={false}
                stroke="#888888"
                fontSize={12}
                width={120}
              />
              <XAxis dataKey="total" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      formatCurrency(value as number, CURRENCY)
                    }
                    indicator="dot"
                  />
                }
              />
              <Bar dataKey="total" radius={4}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} name={entry.name} />
                ))}
              </Bar>
            </RechartsBarChart>
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
