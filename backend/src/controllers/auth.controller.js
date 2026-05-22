import { withTransaction } from '../config/db.js';
import { ensureCart } from '../models/cart.model.js';
import {
  deletePendingRegistration,
  findPendingRegistrationByEmail,
  upsertPendingRegistration
} from '../models/pending-registration.model.js';
import { createUser, findAuthUserByEmail, findUserById } from '../models/user.model.js';
import { ensureWishlist } from '../models/wishlist.model.js';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { signToken } from '../utils/jwt.js';
import {
  EMAIL_SERVICE_UNAVAILABLE_MESSAGE,
  getEmailErrorDetails,
  getEmailTransportLogContext,
  isEmailDeliveryConfigured,
  sendRegistrationOtpEmail
} from '../utils/mailer.js';
import { generateOtpCode, hashOtpCode, verifyOtpCode } from '../utils/otp.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import {
  validateLoginPayload,
  validateRegisterOtpVerifyPayload,
  validateRegisterPayload
} from '../validators/auth.validator.js';

const logDevRegistrationOtp = (email, otp) => {
  if (env.nodeEnv !== 'production' || env.allowDevOtpInProduction) {
    console.info(`[DEV OTP] Registration code for ${email}: ${otp}`);
  }
};

export const requestRegistrationOtp = asyncHandler(async (req, res) => {
  const payload = validateRegisterPayload(req.body);
  const existingUser = await findAuthUserByEmail(req.db, payload.email);

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const passwordHash = await hashPassword(payload.password);
  const otp = generateOtpCode();
  const expiresAt = new Date(Date.now() + env.otpExpiresMinutes * 60_000);

  await upsertPendingRegistration(req.db, {
    email: payload.email,
    name: payload.name,
    passwordHash,
    otpHash: hashOtpCode(payload.email, otp),
    expiresAt
  });

  const emailDeliveryConfigured = isEmailDeliveryConfigured();
  let deliveryMethod = emailDeliveryConfigured ? 'email' : 'development';

  if (emailDeliveryConfigured) {
    try {
      await sendRegistrationOtpEmail({
        email: payload.email,
        name: payload.name,
        otp,
        expiresInMinutes: env.otpExpiresMinutes
      });
    } catch (error) {
      console.error('Failed to send registration OTP email', {
        email: payload.email,
        ...getEmailTransportLogContext(),
        ...getEmailErrorDetails(error)
      });

      if (env.allowDevOtpInProduction) {
        deliveryMethod = 'development';
        logDevRegistrationOtp(payload.email, otp);
      } else {
        throw new ApiError(503, EMAIL_SERVICE_UNAVAILABLE_MESSAGE);
      }
    }
  } else if (env.nodeEnv === 'production' && !env.allowDevOtpInProduction) {
    throw new ApiError(503, EMAIL_SERVICE_UNAVAILABLE_MESSAGE);
  } else {
    deliveryMethod = 'development';
    logDevRegistrationOtp(payload.email, otp);
  }

  res.status(202).json({
    success: true,
    message:
      deliveryMethod === 'email'
        ? 'Verification code sent to your email.'
        : 'Local testing mode is active. Use the OTP shown in the app.',
    data: {
      email: payload.email,
      expiresInMinutes: env.otpExpiresMinutes,
      deliveryMethod,
      devOtp: deliveryMethod === 'development' ? otp : undefined
    }
  });
});

export const verifyRegistrationOtp = asyncHandler(async (req, res) => {
  const payload = validateRegisterOtpVerifyPayload(req.body);
  const pendingRegistration = await findPendingRegistrationByEmail(req.db, payload.email);

  if (!pendingRegistration) {
    throw new ApiError(404, 'No pending registration found. Request a new verification code.');
  }

  if (new Date(pendingRegistration.expiresAt).getTime() < Date.now()) {
    await deletePendingRegistration(req.db, payload.email);
    throw new ApiError(400, 'The verification code has expired. Request a new one.');
  }

  if (!verifyOtpCode(payload.email, payload.otp, pendingRegistration.otpHash)) {
    throw new ApiError(400, 'Invalid verification code.');
  }

  const existingUser = await findAuthUserByEmail(req.db, payload.email);

  if (existingUser) {
    await deletePendingRegistration(req.db, payload.email);
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const user = await withTransaction(async (client) => {
    const createdUser = await createUser(client, {
      name: pendingRegistration.name,
      email: pendingRegistration.email,
      passwordHash: pendingRegistration.passwordHash
    });
    await ensureCart(client, createdUser.id);
    await ensureWishlist(client, createdUser.id);
    await deletePendingRegistration(client, pendingRegistration.email);
    return createdUser;
  });

  const token = signToken(user);

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: { token, user }
  });
});

export const login = asyncHandler(async (req, res) => {
  const payload = validateLoginPayload(req.body);
  const user = await findAuthUserByEmail(req.db, payload.email);

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const passwordMatches = await verifyPassword(payload.password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const { passwordHash, ...publicUser } = user;
  const token = signToken(publicUser);

  res.json({
    success: true,
    message: 'Logged in successfully.',
    data: { token, user: publicUser }
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await findUserById(req.db, req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  res.json({
    success: true,
    data: user
  });
});
