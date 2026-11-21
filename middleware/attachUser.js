import { toUserDto } from "../dtos/userDto.js";
import * as authRepository from "../repositories/authRepository.js";

export const attachUser = async (req, res, next) => {
  try {
    const userId = req.session?.userId;
    const account = userId ? await authRepository.findById(userId) : null;

    if (account) {
      const safeUser = toUserDto(account);
      req.user = safeUser;
      res.locals.user = safeUser;
    }
    next();
  } catch (err) {
    next(err);
  }
};
