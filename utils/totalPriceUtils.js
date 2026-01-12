
const getNightCount = (checkInDate, checkOutDate) => {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  if (isNaN(start) || isNaN(end)) {
    throw new Error("Invalid date format");
  }
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};
exports.calculateTotalPrice = (checkIn, checkOut, pricePerNight, rooms) => {
  const nights = getNightCount(checkIn, checkOut);
  
  if (nights <= 0) {
    throw new Error("Check-out date must be after check-in date");
  }
  
  if (rooms < 1) {
    throw new Error("Minimum 1 room required");
  }

  // Calculate total
  const total = nights * pricePerNight * rooms;
  
  return total;
};
exports.formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};