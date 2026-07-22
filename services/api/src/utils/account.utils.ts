export async function generateAccountNumber(): Promise<string> {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  const accountNumber = `${timestamp}${random}`.slice(0, 16).padEnd(16, '0');
  return accountNumber;
}
