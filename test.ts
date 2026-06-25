import { getCampaignClient } from "./src/lib/soroban.ts";
async function main() {
  const client = getCampaignClient("CCEV6OOEKAWI3HEMP23H2RLOCC7HCKQKUB7TGNCE2WFQ7OHSLDJ6A2SM");
  const { result } = await client.get_state();
  console.log("Deadline value:", result.deadline);
  console.log("Deadline type:", typeof result.deadline);
  console.log("Deadline Number:", Number(result.deadline));
}
main();
