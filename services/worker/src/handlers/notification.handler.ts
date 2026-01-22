
// Functions to handle sending notifications via email
export async function sendEmail(event: any) {
  console.log("Sending EMAIL for event:", event.type);
}

// Functions to handle sending notifications via webhooks
export async function sendWebhook(event: any) {
  console.log("Sending WEBHOOK for event:", event.type);
}
