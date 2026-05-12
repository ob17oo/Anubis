"use client"

import * as React from "react"
import { Accordion } from "radix-ui"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const AccordionRoot = Accordion.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof Accordion.Item>,
  React.ComponentPropsWithoutRef<typeof Accordion.Item>
>(({ className, ...props }, ref) => (
  <Accordion.Item
    ref={ref}
    className={cn("border-b border-border/70", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof Accordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof Accordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <Accordion.Header className="flex">
    <Accordion.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-left text-base font-medium transition-all",
        "hover:opacity-90 [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon className="size-5 shrink-0 transition-transform duration-200 opacity-70" />
    </Accordion.Trigger>
  </Accordion.Header>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof Accordion.Content>,
  React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ className, children, ...props }, ref) => (
  <Accordion.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm",
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    )}
    {...props}
  >
    <div className={cn("pb-4 pt-0 opacity-80 leading-relaxed", className)}>
      {children}
    </div>
  </Accordion.Content>
))
AccordionContent.displayName = "AccordionContent"

export {
  AccordionRoot as Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}

