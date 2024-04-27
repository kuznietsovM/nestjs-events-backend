import { AuthGuard } from "@nestjs/passport";

export class AuthGuardLocal extends AuthGuard('jwt') {
    
}