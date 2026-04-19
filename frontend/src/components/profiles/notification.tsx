import { useState } from 'react';
import { Button } from '../ui/button';

const Notification = () => {
	const [notifications, setNotifications] = useState({
		newMessage: true,
		savedListing: true,
		newReview: true,
		priceAlert: true,
		weeklyDigest: false,
		promotional: false,
	});
	return (
		<div className='space-y-6'>
			<h3 className='text-lg font-medium mb-4'>Notification Preferences</h3>
			<div className='space-y-4'>
				{[
					{
						key: 'newMessage',
						label: 'New message received',
						desc: 'Get notified when someone sends you a message',
					},
					{
						key: 'savedListing',
						label: 'Someone saved my listing',
						desc: 'Know when your room gets saved by potential tenants',
					},
					{
						key: 'newReview',
						label: 'New review on my room',
						desc: 'Be alerted when someone reviews your listing',
					},
					{
						key: 'priceAlert',
						label: 'Price drop alerts for saved rooms',
						desc: 'Get notified about price changes on saved rooms',
					},
					{
						key: 'weeklyDigest',
						label: 'Rental market weekly digest',
						desc: 'Weekly summary of market trends and new listings',
					},
					{
						key: 'promotional',
						label: 'Promotional emails',
						desc: 'Receive special offers and promotional content',
					},
				].map((item) => (
					<div
						key={item.key}
						className='flex items-start justify-between py-4 border-b border-border last:border-0'>
						<div className='flex-1'>
							<p className='font-medium mb-1'>{item.label}</p>
							<p className='text-sm text-muted-foreground'>{item.desc}</p>
						</div>
						<label className='relative inline-flex items-center cursor-pointer ml-4'>
							<input
								type='checkbox'
								checked={notifications[item.key as keyof typeof notifications]}
								onChange={(e) =>
									setNotifications({
										...notifications,
										[item.key]: e.target.checked,
									})
								}
								className='sr-only peer'
							/>
							<div className="w-11 h-6 bg-[#cbced4] rounded-full peer peer-checked:bg-primary text-primary peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
						</label>
					</div>
				))}
			</div>

			<div className='flex justify-end pt-4'>
				<Button className='bg-primary text-white px-6 h-10 rounded-lg'>
					Save Preferences
				</Button>
			</div>
		</div>
	);
};

export default Notification;
