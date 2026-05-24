/** HubSpot CRM adapter — implement when HUBSPOT_API_KEY is set */

export async function createLead(data: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}) {
  if (!process.env.HUBSPOT_API_KEY) {
    return { skipped: true };
  }
  // TODO: POST to HubSpot Forms API or CRM objects
  void data;
  return { ok: true };
}
