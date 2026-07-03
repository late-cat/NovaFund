import { getFactoryClient } from "./src/lib/soroban";
async function run() {
  const factory = getFactoryClient();
  const { result } = await factory.get_campaigns({ start: 0, limit: 100 });
  console.log(result);
}
run();
