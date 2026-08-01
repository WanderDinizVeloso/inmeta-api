-- CreateTable
CREATE TABLE "employee_document_requirements" (
    "id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,
    "document_type_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "employee_document_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_submissions" (
    "id" UUID NOT NULL,
    "requirement_id" UUID NOT NULL,
    "logical_url" VARCHAR(500) NOT NULL,
    "version" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "document_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_document_requirements_employee_id_document_type_id_key" ON "employee_document_requirements"("employee_id", "document_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "document_submissions_requirement_id_version_key" ON "document_submissions"("requirement_id", "version");

-- AddForeignKey
ALTER TABLE "employee_document_requirements" ADD CONSTRAINT "employee_document_requirements_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_document_requirements" ADD CONSTRAINT "employee_document_requirements_document_type_id_fkey" FOREIGN KEY ("document_type_id") REFERENCES "document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_submissions" ADD CONSTRAINT "document_submissions_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "employee_document_requirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
