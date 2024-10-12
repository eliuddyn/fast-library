"use client"

import * as React from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { CalendarWithMonthYear } from "@/components/CalendarWithMonthYear"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import PageHeader from '@/components/PageHeader'

const AdminDashboardPage = () => {

    const [date, setDate] = React.useState<Date>()

    return (
        <>
            <PageHeader pageName="Dashboard" />

            <div>AdminDashboardPage</div>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <CalendarWithMonthYear
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        autoFocus
                        startMonth={new Date(1999, 11)}
                        endMonth={new Date(2025, 2)}
                    />
                </PopoverContent>
            </Popover>
        </>
    )
}

export default AdminDashboardPage