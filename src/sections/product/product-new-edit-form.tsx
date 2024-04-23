import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import {
  // CITY_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_SELECT_OPTIONS,
  PRODUCT_SERVICE_OPTIONS,
  PRODUCT_EXPERIENCE_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFRadioGroup,
  RHFMultiCheckbox,
} from 'src/components/hook-form';

import { IProductItem } from 'src/types/product';

type Props = {
  currentProduct?: IProductItem;
};

export default function ProductNewEditForm({ currentProduct }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    images: Yup.array().min(1, 'Images is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    category: Yup.string().required('Category is required'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    description: Yup.string().required('Description is required'),
    // not required
    taxes: Yup.number(),
    newLabel: Yup.object().shape({
      enabled: Yup.boolean(),
      content: Yup.string(),
    }),
    saleLabel: Yup.object().shape({
      enabled: Yup.boolean(),
      content: Yup.string(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      subDescription: currentProduct?.subDescription || '',
      images: currentProduct?.images || [],
      //
      code: currentProduct?.code || '',
      sku: currentProduct?.sku || '',
      price: currentProduct?.price || 0,
      quantity: currentProduct?.quantity || 0,
      priceSale: currentProduct?.priceSale || 0,
      tags: currentProduct?.tags || [],
      taxes: currentProduct?.taxes || 0,
      gender: currentProduct?.gender || '',
      category: currentProduct?.category || '',
      colors: currentProduct?.colors || [],
      sizes: currentProduct?.sizes || [],
      newLabel: currentProduct?.newLabel || { enabled: false, content: '' },
      saleLabel: currentProduct?.saleLabel || { enabled: false, content: '' },
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentProduct?.taxes || 0);
    }
  }, [currentProduct?.taxes, includeTaxes, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.product.root);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Define Ideal Creator
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Details about the Product</Typography>
              <Typography variant="subtitle2">
                Choose want kind pof post creator will have to publish on social platform in return
                for the discount for your product(s) or service(s).
              </Typography>
            </Stack>

            <RHFSelect
              native
              name="category"
              label="Choose Category"
              InputLabelProps={{ shrink: true }}
            >
              {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                <optgroup key={category.group} label={category.group}>
                  {category.classify.map((classify) => (
                    <option key={classify} value={classify}>
                      {classify}
                    </option>
                  ))}
                </optgroup>
              ))}
            </RHFSelect>

            <RHFSelect
              native
              name="category"
              label="Choose Platform"
              InputLabelProps={{ shrink: true }}
            >
              {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                <optgroup key={category.group} label={category.group}>
                  {category.classify.map((classify) => (
                    <option key={classify} value={classify}>
                      {classify}
                    </option>
                  ))}
                </optgroup>
              ))}
            </RHFSelect>

            <RHFSelect
              native
              name="category"
              label="Your Industry"
              InputLabelProps={{ shrink: true }}
            >
              {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                <optgroup key={category.group} label={category.group}>
                  {category.classify.map((classify) => (
                    <option key={classify} value={classify}>
                      {classify}
                    </option>
                  ))}
                </optgroup>
              ))}
            </RHFSelect>

            <RHFSelect native name="category" label="Your Goal" InputLabelProps={{ shrink: true }}>
              {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                <optgroup key={category.group} label={category.group}>
                  {category.classify.map((classify) => (
                    <option key={classify} value={classify}>
                      {classify}
                    </option>
                  ))}
                </optgroup>
              ))}
            </RHFSelect>

            <RHFTextField name="name" label="Product Name" />

            <RHFTextField name="subDescription" label="Sub Description" multiline rows={4} />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">
                Post Descriptions for want you want creator to publish on social Platform
              </Typography>
              <RHFEditor simple name="description" />
            </Stack>

            <Stack spacing={3}>
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField
                  name="text"
                  label="#tag1"
                  placeholder="#brandindustry"
                  type="text"
                  InputLabelProps={{ shrink: true }}
                />

                <RHFTextField
                  name="text"
                  label="@tag2"
                  placeholder="@brandindustry"
                  type="text"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Stack spacing={1}>
                <Typography variant="subtitle2">Experience of Work</Typography>
                <Typography variant="subtitle2">
                  Choose which type of creator can take part it your campaign and publish a post!
                </Typography>
              </Stack>

              <Stack spacing={1}>
                <RHFRadioGroup row name="select" spacing={2} options={PRODUCT_SELECT_OPTIONS} />
              </Stack>

              <Stack spacing={1}>
                <RHFRadioGroup
                  row
                  name="experience"
                  spacing={2}
                  options={PRODUCT_EXPERIENCE_OPTIONS}
                />
              </Stack>

              <Stack spacing={1}>
                <RHFSelect
                  native
                  name="category"
                  label="Location"
                  InputLabelProps={{ shrink: true }}
                >
                  {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                    <optgroup key={category.group} label={category.group}>
                      {category.classify.map((classify) => (
                        <option key={classify} value={classify}>
                          {classify}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </RHFSelect>
              </Stack>

              <Stack spacing={1}>
                <Typography variant="subtitle2">Gender</Typography>
                <RHFMultiCheckbox row name="gender" spacing={2} options={PRODUCT_GENDER_OPTIONS} />
              </Stack>

              <Stack spacing={1}>
                <RHFSelect native name="category" label="Reach" InputLabelProps={{ shrink: true }}>
                  {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                    <optgroup key={category.group} label={category.group}>
                      {category.classify.map((classify) => (
                        <option key={classify} value={classify}>
                          {classify}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </RHFSelect>
              </Stack>

              {/* <Stack spacing={1}>
                <Typography variant="subtitle2">Cities</Typography>
                <RHFMultiCheckbox row name="city" spacing={2} options={CITY_OPTIONS} />
              </Stack> */}

              <Stack spacing={1}>
                <RHFSelect native name="cities" label="Location" InputLabelProps={{ shrink: true }}>
                  {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                    <optgroup key={category.group} label={category.group}>
                      {category.classify.map((classify) => (
                        <option key={classify} value={classify}>
                          {classify}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </RHFSelect>
              </Stack>
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Product Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="body2">
                You have already chosen what kind of social post you want to receive! Now choose
                which product(s) or service(s).
              </Typography>
            </Stack>

            <RHFTextField
              name="name"
              label="Product Name"
              placeholder="Camelab"
              type="text"
              InputLabelProps={{ shrink: true }}
            />

            <RHFTextField
              name="url"
              label="Product URL"
              placeholder="www.camelab.com"
              type="text"
              InputLabelProps={{ shrink: true }}
            />

            <Stack spacing={1}>
              <Typography variant="subtitle2">What are you offering?</Typography>
              <RHFRadioGroup row name="service" spacing={2} options={PRODUCT_SERVICE_OPTIONS} />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>

            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name="email"
                type="email"
                label="Email"
                placeholder="ahmed@camelab.co"
              />

              <RHFTextField
                name="number"
                type="number"
                label="Phone Number"
                placeholder="+966 134 563 356"
              />

              <RHFTextField
                name="link"
                type="text"
                label="Paste a link to the company's instagram"
                placeholder="www.instagram.com"
              />

              <RHFTextField
                name="link"
                type="text"
                label="Website link"
                placeholder="www.camelab.com"
              />
            </Box>

            <RHFTextField multiline rows={4} name="notes" label="Additional Notes" />
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Creator Discount
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Select package according to the video
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                You will give creator a discount on in exchange for posts
              </Typography>
              <Typography variant="subtitle2">Set the discount for creator</Typography>
            </Stack>

            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <Button type="button" sx={{ py: 2 }} style={{ border: '1px solid black' }}>
                Package1 - Free
              </Button>

              <Button type="button" sx={{ py: 2 }} style={{ border: '1px solid black' }}>
                Package2 - 70%
              </Button>

              <Button type="button" sx={{ py: 2 }} style={{ border: '1px solid black' }}>
                Package3 - 80%
              </Button>

              <Button type="button" sx={{ py: 2 }} style={{ border: '1px solid black' }}>
                Package4 - Other
              </Button>

              <FormControlLabel
                label="Additional discount for the followers"
                control={<Switch checked={includeTaxes} onChange={handleChangeIncludeTaxes} />}
              />
            </Box>

            <Stack spacing={1}>
              <Typography variant="subtitle2">Additional discount for the followers</Typography>
            </Stack>

            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <Button type="button" sx={{ py: 2 }} style={{ border: '1px solid black' }}>
                Package1 - Free
              </Button>

              <Button type="button" sx={{ py: 2 }} style={{ border: '1px solid black' }}>
                Package2 - 70%
              </Button>

              <Button type="button" sx={{ py: 2 }} style={{ border: '1px solid black' }}>
                Package3 - 80%
              </Button>

              <Button type="button" sx={{ py: 2 }} style={{ border: '1px solid black' }}>
                Package4 - Other
              </Button>
            </Box>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center' }}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Publish"
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProduct ? 'Select Plan' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderPricing}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
