import { getFactoryClient } from "./src/lib/soroban";
async function run() {
  const factory = getFactoryClient();
  const { result } = await factory.get_campaigns();
  console.log(result);
}
run();
