import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsDate,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
} from "class-validator";

// all fields are optional

export class UpdateClientDto {
	@ApiProperty({
		description: "Customer's full name",
		example: "John Doe",
		required: false,
	})
	@IsOptional()
	@IsString()
	name?: string;

	@ApiProperty({
		description: "Customer's CPF",
		example: "123.456.789-10",
		required: false,
	})
	@IsOptional()
	@IsString()
	@Matches(/^\d{3}(\.\d{3}){2}-\d{2}$|^\d{11}$/, {
		message: "CPF must be 11 digits",
	})
	cpf?: string;

	@ApiProperty({
		description: "Customer's date of birth",
		example: "1994-01-01",
		required: false,
	})
	@IsOptional()
	@Type(() => Date)
	birthDate?: Date;

	@ApiProperty({
		description: "Customer's e-mail",
		example: "jhon@mail.com",
		required: false,
	})
	@IsOptional()
	@IsEmail()
	email?: string;

	@ApiProperty({
		description: "Customer's phone number",
		example: "(11) 12345-6789",
		required: false,
	})
	@IsOptional()
	@Matches(/^\(\d{2}\)\s?\d{5}-\d{4}$/, {
		message: "Phone must be in format: (11) 12345-6789",
	})
	phone?: string;
}
