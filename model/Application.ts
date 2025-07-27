import * as v from 'valibot'

const dateSchema = v.pipe(v.union([v.date(), v.string()]), v.transform((value) => new Date(value)))
const boolSchema = v.pipe(v.union([v.boolean(), v.number()]), v.transform((value) => value === 1))

export const applicationTableName = 'applications'
export const applicationSchema = v.object({
    id: v.optional(v.number()),
    applying_date: dateSchema,
    employer: v.string(),
    webpage: v.string(),
    position: v.string(),
    contact_person: v.optional(v.string(), '-'),
    contact_person_gender: v.optional(v.string(), 'm'),
    acknowledgement_date: v.optional(dateSchema),
    interview_date: v.optional(dateSchema),
    declination_date: v.optional(dateSchema),
    acknowledged_occured: v.optional(boolSchema, false),
    interview_occured: v.optional(boolSchema, false),
    declination_occured: v.optional(boolSchema, false),
    contact_type_id: v.number(),
    status_id: v.number()
})

export type ApplicationInput = v.InferInput<typeof applicationSchema>
export type Application = v.InferOutput<typeof applicationSchema>
/*
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

    constructor(data: any | null | undefined) {
        // Parse with Valibot schema (which now includes defaults)
        const result = v.safeParse(applicationSchema, data)
        if (!result.success) {
            throw new Error(`Invalid application data: ${JSON.stringify(result.issues, null, 2)}`)
        }
        // Assign validated data
        Object.assign(this, result.output)
    }
}
*/