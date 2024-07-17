import RazorpayButton from '@/components/buttons/rzp_btn';
import Sidebar from '@/components/common/sidebar';
import OrgOnlyAndProtect from '@/utils/wrappers/org_only';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';

const Subscriptions = () => {
  return (
    <BaseWrapper title="Notifications">
      <Sidebar index={9} />
      <MainWrapper>
        <div className="w-full max-lg:w-full mx-auto flex flex-col gap-8 px-8 max-md:px-4 py-6 font-primary relative transition-ease-out-500">
          <div className="w-fit text-5xl max-md:text-3xl font-extrabold pl-2">Subscriptions</div>
          <div className="w-full grid grid-cols-3 gap-8">
            <SubscriptionCard title="Free" description="For trial" amount={0} subscription="ORG_FREE" />
            <SubscriptionCard title="Pro" description="For starting orgs" amount={1000} subscription="ORG_BASE" />
            <SubscriptionCard
              title="Premium"
              description="For Professional Orgs"
              amount={1500}
              subscription="ORG_PREMIUM"
            />
          </div>
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

interface Props {
  title: string;
  description: string;
  amount: number;
  subscription: string;
}

const SubscriptionCard = ({ title, description, amount, subscription }: Props) => {
  return (
    <div className="flex flex-col gap-6 bg-white rounded-3xl p-6 hover:shadow-lg transition-ease-500">
      <div className="grid items-center justify-center w-full grid-cols-1 text-left">
        <div>
          <h2 className="text-lg font-medium tracking-tighter text-primary_black lg:text-3xl">{title}</h2>
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        </div>
        <div className="mt-6">
          <p>
            <span className="text-5xl font-light tracking-tight text-black">₹{amount}</span>
            <span className="text-base font-medium text-gray-500"> /mo </span>
          </p>
        </div>
      </div>

      <div className="w-full flex-center">
        <RazorpayButton subscription={subscription} />
      </div>
    </div>
  );
};

export default OrgOnlyAndProtect(Subscriptions);
