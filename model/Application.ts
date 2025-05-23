import { z } from 'zod'

export const applicationTableName = 'applications'

export const applicationSchema = z.object({
    id: z.number().default(0),
    applying_date: z.date().default(() => new Date()),
    employer: z.string().default(''),
    webpage: z.string().default(''),
    position: z.string().default(''),
    contact_person: z.string().default(''),
    contact_person_gender: z.string().default(''),
    acknowledgement_date: z.date().nullable().default(null),
    interview_date: z.date().nullable().default(null),
    declination_date: z.date().nullable().default(null),
    acknowledged_occured: z.boolean().default(false),
    interview_occured: z.boolean().default(false),
    declination_occured: z.boolean().default(false),
    contact_type_id: z.number().default(1),
    status_id: z.number().default(1)
})

export type ApplicationSchema = z.infer<typeof applicationSchema>

export type DateField = 'applying_date' | 'acknowledgement_date' | 'interview_date' | 'declination_date'
export type BooleanField = 'acknowledged_occured' | 'interview_occured' | 'declination_occured'
export type NumberField = 'contact_type_id' | 'status_id'
export type StringField = 'employer' | 'webpage' | 'position' | 'contact_person' | 'contact_person_gender'

export class Application {
    id!: number
    applying_date!: Date
    employer!: string
    webpage!: string
    position!: string
    contact_person!: string
    contact_person_gender!: string
    acknowledgement_date!: Date | null
    interview_date!: Date | null
    declination_date!: Date | null
    acknowledged_occured!: boolean
    interview_occured!: boolean
    declination_occured!: boolean
    contact_type_id!: number
    status_id!: number

    private getDate(input: Date | string): Date  {
        if (typeof input === 'string') {
            return new Date(input)
        } else {
            return input
        }
    }

    constructor(data: any | null | undefined) {
        // Convert any string dates to Date objects in the input data
        const processedData = data ? {
            ...data,
            applying_date: data.applying_date ? this.getDate(data.applying_date) : undefined,
            acknowledgement_date: data.acknowledgement_date ? this.getDate(data.acknowledgement_date) : undefined,
            interview_date: data.interview_date ? this.getDate(data.interview_date) : undefined,
            declination_date: data.declination_date ? this.getDate(data.declination_date) : undefined,
        } : {}

        // Parse with Zod schema (which now includes defaults)
        const result = applicationSchema.safeParse(processedData)
        if (!result.success) {
            throw new Error(`Invalid application data: ${result.error.message}`)
        }

        // Assign validated data
        Object.assign(this, result.data)
    }
}
