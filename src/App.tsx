import { useEffect, useState } from 'react'

import {
  DatePicker,
  DesktopDateTimePicker,
  DesktopTimePicker,
  Language,
  NepaliDate,
  NepaliDateTime,
  NepaliTime,
} from '.'

export default function App() {
  const { toggleTheme } = useThemeToggle()
  const [selectLang, setSelectLang] = useState<Language>('ne')

  const [selectedDate, setSelectedDate] = useState<NepaliDate>()
  const handleOnDateSelect = (date?: NepaliDate) => {
    if (!date) {
      setSelectedDate(undefined)
      return
    }

    setSelectedDate(date)
  }

  const [time, setTime] = useState<NepaliTime>()
  const handleOnTimeSelect = (time?: NepaliTime) => {
    if (!time) {
      setTime(undefined)
      return
    }

    setTime(time)
  }

  const [dateTime, setDateTime] = useState<NepaliDateTime>()
  const handleOnDateTimeSelect = (date: NepaliDateTime) => {
    if (!date.valid) {
      setDateTime(undefined)
      return
    }

    setDateTime(date)
  }

  return (
    <div className="ne-dt-p-4 ne-dt-min-h-screen">
      <p className="ne-dt-text-lg ne-dt-text-gray-600">
        This is a playground for rendering components.
      </p>

      <div className="ne-dt-flex ne-dt-flex-col ne-dt-max-w-lg ne-dt-mt-4 ne-dt-md:mt-6">
        <div>
          <label htmlFor="lang" className="ne-dt-text-lg ne-dt-mr-2">
            Choose Language
          </label>
          <select
            className="ne-dt-py-2 ne-dt-px-4 ne-dt-text-lg ne-dt-bg-white ne-dt-border ne-dt-border-gray-300 ne-dt-rounded-md ne-dt-shadow-sm focus:ne-dt-outline-none focus:ne-dt-ring-1 focus:ne-dt-ring-blue-500 ne-dt-appearance-none ne-dt-w-fit"
            onChange={(e) => setSelectLang(e.target.value as Language)}
          >
            <option value="ne">Nepali</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="ne-dt-mt-4">
          <label htmlFor="theme" className="ne-dt-text-lg ne-dt-mr-2">
            Choose Theme
          </label>
          <select
            className="ne-dt-py-2 ne-dt-px-4 ne-dt-text-lg ne-dt-bg-white ne-dt-border ne-dt-border-gray-300 ne-dt-rounded-md ne-dt-shadow-sm focus:ne-dt-outline-none focus:ne-dt-ring-1 focus:ne-dt-ring-blue-500 ne-dt-appearance-none ne-dt-w-fit"
            onChange={(e) => toggleTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="ne-dt-flex ne-dt-flex-col ne-dt-max-w-lg ne-dt-mt-4 ne-dt-md:mt-6">
        <div className="ne-dt-mb-8">
          <label htmlFor="datepicker" className="ne-dt-text-lg">
            Date Picker
          </label>

          <DatePicker
            lang={selectLang}
            dateInput={{
              fullWidth: true,
            }}
            onDateSelect={handleOnDateSelect}
          />

          {selectedDate && <p>{JSON.stringify(selectedDate)}</p>}
        </div>

        <div className="ne-dt-mb-8">
          <label htmlFor="timepicker" className="ne-dt-text-lg">
            Time Picker
          </label>

          <DesktopTimePicker
            lang={selectLang}
            timeInput={{
              fullWidth: true,
            }}
            onTimeSelect={handleOnTimeSelect}
          />

          {time && <p>{JSON.stringify(time)}</p>}
        </div>

        <div className="ne-dt-mb1-8">
          <label htmlFor="datetimepicker" className="ne-dt-text-lg">
            Datetime Picker
          </label>

          <DesktopDateTimePicker
            lang={selectLang}
            dateInput={{
              fullWidth: true,
            }}
            onDateTimeSelect={handleOnDateTimeSelect}
          />

          {dateTime && <p>{JSON.stringify(dateTime)}</p>}
        </div>
      </div>
    </div>
  )
}

function useThemeToggle() {
  const handleOnToggleTheme = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.theme = theme
  }

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  return {
    toggleTheme: handleOnToggleTheme,
  }
}
