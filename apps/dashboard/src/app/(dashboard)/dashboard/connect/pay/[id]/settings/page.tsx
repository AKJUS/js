import { notFound } from "next/navigation";
import { PayConfig } from "../../../../../../../components/pay/PayConfig";
import { getAPIKey } from "../../../../../../api/lib/getAPIKeys";

export default async function Page(props: {
  params: {
    id: string;
  };
}) {
  const apiKey = await getAPIKey(props.params.id);

  if (!apiKey) {
    notFound();
  }

  return <PayConfig apiKey={apiKey} />;
}
