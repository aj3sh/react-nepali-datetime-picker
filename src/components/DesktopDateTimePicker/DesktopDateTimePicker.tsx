import { useEffect, useRef, useState } from 'react'

import CalendarMonth from '@/assets/CalendarMonth.svg'
import ClockOutlineIcon from '@/assets/ClockOutline.svg'
import { Calendar, CalendarProps } from '@/components/Calendar/Calendar'
import {
  DateTimeInput,
  DateTimeInputProps,
  DateTimeInputTargetValue,
} from '@/components/DateTimeInput/DateTimeInput'
import {
  DesktopTime,
  DesktopTimeProps,
} from '@/components/DesktopTime/DesktopTime'
import { Modal, ModalProps } from '@/components/Modal/Modal'
import { Button } from '@/components/ui/Button/Button'
import { useNepaliCalendar } from '@/hooks/useNepaliCalendar'
import { useNepaliTime } from '@/hooks/useNepaliTime'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/plugins/twMerge'
import { NepaliTime } from '@/types'
import { HourFormat } from '@/types/HourFormat'
import { Language } from '@/types/Language'
import { NepaliDate } from '@/types/NepaliDate'
import { NepaliDateTime } from '@/types/NepaliDateTime'
import { getMonthLabel } from '@/utils/nepaliDate'
import { validateNepaliDateTime } from '@/utils/nepaliDateTime'

interface DesktopDateTimePickerProps {
  className?: string
  lang?: Language
  value?: string
  onDateTimeSelect?: (selectedDateTime: NepaliDateTime) => void
  modal?: ModalProps
  hourFormat?: HourFormat
  dateInput?: DateTimeInputProps
  calendar?: CalendarProps
  time?: DesktopTimeProps
  trans?: {
    title?: string
    cancel?: string
    confirm?: string
  }
}
export const DesktopDateTimePicker = ({
  className = '',
  lang = 'ne',
  modal = {},
  value = '',
  onDateTimeSelect,
  dateInput = {},
  hourFormat = 12,
  calendar = {},
  time = {},
  trans = {},
}: DesktopDateTimePickerProps) => {
  const {
    input: { nativeInput, icon: inputIcon, ...inputRest } = {},
    hint = {},
    ...dateInputRest
  } = dateInput
  const { onClose: onCloseModal, ...modalRest } = modal

  const { className: calendarClassName = '', ...calendarRest } = calendar
  const { className: timeClassName = '', ...timeRest } = time

  const [showModal, setShowModal] = useState<boolean>(false)
  const handleOnInputDateClick = () => {
    setShowModal(() => true)
  }
  const handleOnModalClose = () => {
    setShowModal(() => false)
    onCloseModal?.()
  }
  const handleOnCancel = () => {
    setShowModal(() => false)
    onCloseModal?.()
  }

  const validatedDateTime = validateNepaliDateTime(value, lang, hourFormat)
  const [selectedDateTime, setSelectedDateTime] = useState<NepaliDateTime>({
    valid: validatedDateTime.valid,
    ...(validatedDateTime.value ?? {}),
  })
  const selectedDateTimeRef = useRef<NepaliDateTime>({
    valid: validatedDateTime.valid,
    ...(validatedDateTime.value ?? {}),
  })

  const handleOnSelectDate = (date: NepaliDate) => {
    const isTimeValid =
      hourFormat === 12
        ? selectedDateTime?.time?.day?.value !== undefined
        : true

    const dateTime = {
      valid: isTimeValid,
      date,
      ...(selectedDateTime?.time ? { time: selectedDateTime.time } : {}),
    }
    onDateTimeSelect?.(dateTime)
    setSelectedDateTime(() => dateTime)
    selectedDateTimeRef.current = dateTime
  }
  const handleOnTimeSelect = (time: NepaliTime) => {
    const isTimeValid = hourFormat === 12 ? time.day?.value !== undefined : true

    const dateTime = {
      valid: selectedDateTime?.date && isTimeValid ? true : false,
      ...(isTimeValid ? { time } : {}),
      ...(selectedDateTime?.date ? { date: selectedDateTime.date } : {}),
    }
    onDateTimeSelect?.(dateTime)
    setSelectedDateTime(() => dateTime)
    selectedDateTimeRef.current = dateTime
  }

  const handleOnDateTimeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { value } = e.target

    const targetValue = JSON.parse(value) as DateTimeInputTargetValue

    onDateTimeSelect?.({
      valid: targetValue.valid,
      ...(targetValue.valid
        ? {
            date: targetValue.value?.date,
            time: targetValue.value?.time,
          }
        : {}),
    })

    selectedDateTimeRef.current = {
      valid: targetValue.valid,
      ...(targetValue.valid
        ? {
            date: targetValue.value?.date,
            time: targetValue.value?.time,
          }
        : {}),
    }
  }
  const handleOnConfirm = () => {
    if (!selectedDateTime) {
      return
    }
    onDateTimeSelect?.({
      valid: true,
      date: selectedDateTime.date,
      time: selectedDateTime.time,
    })
    setShowModal(() => false)
  }

  const dateTimeInputRef = useRef<HTMLInputElement>(null)

  const [currentView, setCurrentView] = useState<'calendar' | 'time'>(
    'calendar',
  )
  const [userClickedOn, setUserClickedOn] = useState<
    'year' | 'monthdate' | 'hour' | 'minute' | 'AM' | 'PM'
  >()
  const [timeDay, setTimeDay] = useState<'AM' | 'PM'>()
  const handleOnUserClickedOn = (
    userClickedOn: 'year' | 'monthdate' | 'hour' | 'minute' | 'AM' | 'PM',
  ) => {
    switch (userClickedOn) {
      case 'year':
      case 'monthdate':
        setCurrentView(() => 'calendar')
        break
      case 'hour':
      case 'minute':
        setCurrentView(() => 'time')
        break
      default:
        break
    }
    setUserClickedOn(() => userClickedOn)
  }

  const handleOnTimeDaySelect = (timeDay: 'AM' | 'PM') => {
    setCurrentView(() => 'time')

    setTimeDay(() => timeDay)
  }

  useEffect(() => {
    if (!selectedDateTime?.time?.day?.value) {
      return
    }
    setTimeDay(() => selectedDateTime.time?.day?.value as 'AM' | 'PM')
  }, [selectedDateTime])

  const {
    currentTime: { hour: currentHour, minute: currentMinute },
    timeDays,
  } = useNepaliTime({
    hourFormat,
    lang,
  })

  const {
    selectedLocalisedYear,
    selectedLocalisedMonth,
    currentLocalisedDate,
  } = useNepaliCalendar({
    lang,
    shortMonth: true,
  })

  const { t } = useTranslation('DesktopDateTimePicker', lang)
  const {
    title = t('title'),
    cancel = t('cancel'),
    confirm = t('confirm'),
  } = trans

  return (
    <div className={cn('ne-dt-relative ne-dt-flex ne-dt-flex-col', className)}>
      <DateTimeInput
        ref={dateTimeInputRef}
        lang={lang}
        value={selectedDateTime}
        hourFormat={hourFormat}
        input={{
          nativeInput: {
            onChange: handleOnDateTimeInputChange,
            placeholder:
              hourFormat === 12
                ? t('dateTimeInputPlaceholder12HourFormat')
                : t('dateTimeInputPlaceholder24HourFormat'),
            ...nativeInput,
          },
          icon: {
            onClick: handleOnInputDateClick,
            ...inputIcon,
          },
          ...inputRest,
        }}
        hint={{
          ...hint,
          error: hint?.error || {
            message: t('dateTimeInputError'),
          },
        }}
        {...dateInputRest}
      />

      {showModal && (
        <Modal
          onClose={handleOnModalClose}
          showModal={showModal}
          inputRef={dateTimeInputRef}
          dataAutoId="desktop-date-time-picker-modal"
          modalContentClassName="ne-dt-border ne-dt-border-primary ne-dt-rounded-md ne-dt-bg-base-100 ne-dt-text-base-content ne-dt-flex ne-dt-flex-col md:ne-dt-flex-row ne-dt-mx-4 md:ne-dt-mx-0 ne-dt-max-h-full ne-dt-overflow-y-auto"
          {...modalRest}
        >
          <div className="ne-dt-p-4 ne-dt-rounded-t-md md:ne-dt-hidden">
            <p className="ne-dt-text-neutral-500 ne-dt-text-sm ne-dt-font-normal">
              {title}
            </p>

            <div className="ne-dt-grid ne-dt-grid-cols-2">
              <div>
                <Button
                  variant="text"
                  onClick={() => handleOnUserClickedOn('year')}
                >
                  <span
                    className={cn(
                      'ne-dt-text-neutral-500 ne-dt-text-base ne-dt-font-normal',
                      userClickedOn === 'year' && 'ne-dt-text-neutral-900',
                    )}
                  >
                    {selectedDateTime?.date?.year.label ??
                      selectedLocalisedYear.label}
                  </span>
                </Button>

                <Button
                  variant="text"
                  onClick={() => handleOnUserClickedOn('monthdate')}
                >
                  <span
                    className={cn(
                      'ne-dt-text-neutral-500 ne-dt-text-4xl ne-dt-font-normal',
                      userClickedOn === 'monthdate' && 'ne-dt-text-neutral-900',
                    )}
                  >
                    {`${
                      getMonthLabel(
                        lang,
                        selectedDateTime?.date?.month.value,
                        true,
                      ) ?? selectedLocalisedMonth.label
                    } ${
                      selectedDateTime?.date?.date?.label ??
                      currentLocalisedDate?.label
                    }`}
                  </span>
                </Button>
              </div>

              <div className="ne-dt-flex ne-dt-flex-row ne-dt-justify-end ne-dt-gap-4">
                <div className="ne-dt-flex ne-dt-flex-row  ne-dt-items-center">
                  <Button
                    variant="text"
                    onClick={() => handleOnUserClickedOn('hour')}
                  >
                    <span
                      className={cn(
                        'ne-dt-text-neutral-500 ne-dt-text-5xl ne-dt-font-normal',
                        userClickedOn === 'hour' && 'ne-dt-text-neutral-900',
                      )}
                    >
                      {selectedDateTime?.time?.hour.label ?? currentHour.label}
                    </span>
                  </Button>
                  <span className="ne-dt-text-neutral-500 ne-dt-text-5xl ne-dt-font-normal">
                    :
                  </span>
                  <Button
                    variant="text"
                    onClick={() => handleOnUserClickedOn('minute')}
                  >
                    <span
                      className={cn(
                        'ne-dt-text-neutral-500 ne-dt-text-5xl ne-dt-font-normal',
                        userClickedOn === 'minute' && 'ne-dt-text-neutral-900',
                      )}
                    >
                      {selectedDateTime?.time?.minute?.label ??
                        currentMinute.label}
                    </span>
                  </Button>
                </div>

                {timeDays.length > 0 && (
                  <div
                    className={cn(
                      'ne-dt-flex ne-dt-flex-col ne-dt-gap-1 ne-dt-justify-center',
                    )}
                  >
                    {timeDays.map((td, index) => (
                      <Button
                        variant="text"
                        onClick={() => handleOnTimeDaySelect(td.value)}
                        selected={timeDay === td.value}
                        key={index}
                      >
                        <span
                          key={userClickedOn}
                          className={cn(
                            'ne-dt-text-neutral-500 ne-dt-text-base ne-dt-font-medium',
                            timeDay === td.value && 'ne-dt-text-neutral-900',
                          )}
                        >
                          {td.label}
                        </span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="ne-dt-grid ne-dt-grid-cols-2 ne-dt-place-items-center ne-dt-pt-2 md:ne-dt-hidden">
            <div
              className={cn(
                'ne-dt-flex ne-dt-flex-col ne-dt-items-center ne-dt-w-full',
                currentView === 'calendar' &&
                  'ne-dt-border-b-2 ne-dt-border-gray-500',
              )}
            >
              <CalendarMonth
                width="36"
                height="36"
                onClick={() => setCurrentView(() => 'calendar')}
              />
            </div>

            <div
              className={cn(
                'ne-dt-flex ne-dt-flex-col ne-dt-items-center ne-dt-w-full',
                currentView === 'time' &&
                  'ne-dt-border-b-2 ne-dt-border-gray-500',
              )}
            >
              <ClockOutlineIcon
                width="36"
                height="36"
                onClick={() => setCurrentView(() => 'time')}
              />
            </div>
          </div>

          {currentView === 'calendar' && (
            <Calendar
              onDateSelect={handleOnSelectDate}
              lang={lang}
              selectedDate={selectedDateTimeRef?.current?.date}
              openYearSelector={userClickedOn === 'year'}
              className={cn(
                'md:ne-dt-border-r ne-dt-border-primary ne-dt-p-2 md:ne-dt-p-4 md:ne-dt-min-w-max',
                calendarClassName,
              )}
              {...calendarRest}
            />
          )}

          {currentView === 'time' && (
            <div className="ne-dt-block ne-dt-w-full md:ne-dt-hidden">
              <DesktopTime
                className={cn('ne-dt-p-2 md:ne-dt-p-4', timeClassName)}
                onTimeSelect={handleOnTimeSelect}
                selectedTime={selectedDateTimeRef?.current?.time}
                lang={lang}
                hourFormat={hourFormat}
                {...timeRest}
              />
            </div>
          )}

          <div className="ne-dt-p-4 ne-dt-flex ne-dt-flex-row ne-dt-justify-end ne-dt-gap-4 ne-dt-rounded-b-md md:ne-dt-hidden ">
            <Button variant="outline" onClick={handleOnCancel}>
              {cancel}
            </Button>

            <Button variant="outline" onClick={handleOnConfirm}>
              {confirm}
            </Button>
          </div>

          <div className="ne-dt-hidden md:ne-dt-block">
            <DesktopTime
              onTimeSelect={handleOnTimeSelect}
              selectedTime={selectedDateTimeRef?.current?.time}
              className={cn('ne-dt-p-2 md:ne-dt-p-4', timeClassName)}
              lang={lang}
              hourFormat={hourFormat}
              {...timeRest}
            />
          </div>
        </Modal>
      )}
    </div>
  )
}
