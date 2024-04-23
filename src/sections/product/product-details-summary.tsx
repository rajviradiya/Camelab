import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import FormProvider from 'src/components/hook-form';

import { IProductItem } from 'src/types/product';
import { ICheckoutItem } from 'src/types/checkout';

// ----------------------------------------------------------------------

type Props = {
  product: IProductItem;
  items?: ICheckoutItem[];
  disabledActions?: boolean;
  onGotoStep?: (step: number) => void;
  onAddCart?: (cartItem: ICheckoutItem) => void;
};

export default function ProductDetailsSummary({
  items,
  product,
  onAddCart,
  onGotoStep,
  disabledActions,
  ...other
}: Props) {
  const router = useRouter();

  const {
    id,
    name,
    sizes,
    price,
    coverUrl,
    colors,
    newLabel,
    available,
    saleLabel,
    inventoryType,
    subDescription,
  } = product;

  const existProduct = !!items?.length && items.map((item) => item.id).includes(id);

  const defaultValues = {
    id,
    name,
    coverUrl,
    available,
    price,
    colors: colors[0],
    size: sizes[4],
    quantity: available < 1 ? 0 : 1,
  };

  const methods = useForm({
    defaultValues,
  });

  const { reset, watch, handleSubmit } = methods;

  const values = watch();

  useEffect(() => {
    if (product) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!existProduct) {
        onAddCart?.({
          ...data,
          colors: [values.colors],
          subTotal: data.price * data.quantity,
        });
      }
      onGotoStep?.(0);
      router.push(paths.product.checkout);
    } catch (error) {
      console.error(error);
    }
  });

  const renderPrice = <Box sx={{ typography: 'h5' }}>{fCurrency(price)}</Box>;

  const renderColorOptions = (
    <Stack direction="row" flexDirection="column">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Category
      </Typography>
      <Typography variant="subtitle2" sx={{ flexGrow: 1, mt: 1 }}>
        Sports Shoes
      </Typography>
    </Stack>
  );

  const renderSizeOptions = (
    <Stack direction="row" flexDirection="column">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Platform for upload
      </Typography>
      <Typography variant="subtitle2" sx={{ flexGrow: 1, mt: 1 }}>
        Instagram
      </Typography>
    </Stack>
  );

  const renderQuantity = (
    <Stack direction="row" flexDirection="column">
      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
        Industry
      </Typography>
      <Typography variant="subtitle2" sx={{ flexGrow: 1, mt: 1 }}>
        Lorem Ipsum
      </Typography>
    </Stack>
  );

  const renderActions = (
    <Stack direction="row">
      <Stack direction="row" flexDirection="column" sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          #tag1
        </Typography>
        <Typography variant="subtitle2" sx={{ flexGrow: 1, mt: 1 }}>
          #brandindustry
        </Typography>
      </Stack>

      <Stack direction="row" flexDirection="column" sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          @tag2
        </Typography>
        <Typography variant="subtitle2" sx={{ flexGrow: 1, mt: 1 }}>
          @brandindustry
        </Typography>
      </Stack>
    </Stack>
  );

  const renderSubDescription = (
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {subDescription}
    </Typography>
  );

  const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
    <Stack direction="row" alignItems="center" spacing={1}>
      {newLabel.enabled && <Label color="info">{newLabel.content}</Label>}
      {saleLabel.enabled && <Label color="error">{saleLabel.content}</Label>}
    </Stack>
  );

  const renderInventoryType = (
    <Box
      component="span"
      sx={{
        typography: 'overline',
        color:
          (inventoryType === 'out of stock' && 'error.main') ||
          (inventoryType === 'low stock' && 'warning.main') ||
          'success.main',
      }}
    >
      {inventoryType}
    </Box>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ pt: 3 }} {...other}>
        <Stack spacing={2} alignItems="flex-start">
          {renderLabels}

          {renderInventoryType}

          <Typography variant="h5">{name}</Typography>

          {renderPrice}

          {renderSubDescription}
        </Stack>

        {renderColorOptions}

        {renderSizeOptions}

        {renderQuantity}

        {renderActions}
      </Stack>
    </FormProvider>
  );
}
