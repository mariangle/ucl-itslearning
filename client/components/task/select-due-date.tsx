'use client'

import * as React from 'react'

import { cn } from '@/lib/util/cn'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { FieldValues, PathValue, Path, UseFormReturn } from 'react-hook-form'
import { Calendar } from '@/components/ui/calendar'
import { Icons } from '@/components/icons'
import { format } from 'date-fns'

interface SelectDueDateProps<T extends FieldValues> {
  form: UseFormReturn<T>
  register: Path<T>
  defaultValue?: Date
}

export default function SelectDueDate<T extends FieldValues>({
  form,
  defaultValue,
  register,
  ...props
}: SelectDueDateProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultValue)

  const onSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setValue(selectedDate)
    }
    setOpen(false)
    console.log(selectedDate)
    form.setValue(register, selectedDate?.toISOString() as PathValue<T, Path<T>>)
  }

  const onRemove = () => {
    setValue(undefined)
    form.unregister(register)
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        {value ? (
          <Button variant={'secondary'} size={'sm'} className={cn('w-fit justify-start')}>
            <Icons.calendar className="mr-2 h-4 w-4" />
            <span className="flex-gap">
              {format(value, 'dd-MM-yyyy')}
              <Icons.close className="h-4 w-4" onClick={onRemove} />
            </span>
          </Button>
        ) : (
          <Button variant={'outline'} size={'sm'} className={cn('w-fit justify-start')}>
            <Icons.calendar className="mr-2 h-4 w-4" />
            <span>Schedule</span>
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="p-0 w-full" align="start">
        <Calendar mode="single" selected={value} onSelect={onSelect} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
