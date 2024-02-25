const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Tour = require('../models/tourModel');

exports.getOverview = catchAsync(async (req, res, next) => {
	const tours = await Tour.find();
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';connect-src https://cdnjs.cloudflare.com https://*.mapbox.com https://127.0.0.1 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
		)
		.render('overview', {
			title: 'All Tours',
			tours,
		});
});
exports.getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findOne({ slug: req.params.slug }).populate({
		path: 'reviews',
		fields: 'review rating user',
	});
	if (!tour) {
		return next(new AppError('There is no tour with that name.', 404));
	}
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';connect-src https://cdnjs.cloudflare.com https://*.mapbox.com https://127.0.0.1 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
		)
		.render('tour', {
			title: `${tour.name} Tour`,
			tour,
		});
});

exports.getLoginForm = (req, res) => {
	res
		.status(200)
		.set(
			'Content-Security-Policy',
			"default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';connect-src https://cdnjs.cloudflare.com https://*.mapbox.com http://127.0.0.1 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;",
		)
		.render('login', {
			title: 'Log into your account',
		});
};
