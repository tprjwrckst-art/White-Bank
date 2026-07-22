export async function generateCardNumber(): string {
  // Generate a random 16-digit card number
  let cardNumber = '4'; // Start with 4 for Visa
  for (let i = 0; i < 15; i++) {
    cardNumber += Math.floor(Math.random() * 10);
  }
  return cardNumber;
}
