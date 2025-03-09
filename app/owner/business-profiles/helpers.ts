/**
 * Business hour type definition
 */
export interface BusinessHour {
  id: string;
  business_id: string;
  day_of_week: string;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

/**
 * Format business hours for display
 *
 * @param hours - Array of business hours (can be null or undefined)
 * @returns Formatted hours object
 */
export function formatBusinessHours(hours: BusinessHour[] | null | undefined) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // If hours is null or undefined, return default hours
  if (!hours) {
    return daysOfWeek.map(day => ({
      day,
      hours: 'Not specified',
      isClosed: false
    }));
  }

  // Create a map of day to hours
  const hoursMap = hours.reduce((acc: Record<string, BusinessHour>, hour) => {
    acc[hour.day_of_week] = hour;
    return acc;
  }, {});

  // Format each day
  return daysOfWeek.map(day => {
    const dayHours = hoursMap[day];

    if (!dayHours) {
      return { day, hours: 'Not specified', isClosed: false };
    }

    if (dayHours.is_closed) {
      return { day, hours: 'Closed', isClosed: true };
    }

    return {
      day,
      hours: `${dayHours.open_time} - ${dayHours.close_time}`,
      isClosed: false
    };
  });
} 