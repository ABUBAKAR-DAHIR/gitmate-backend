import {IsUUID} from "class-validator"

export class CreateMatchDto {
    @IsUUID()
    userId!: string
}
