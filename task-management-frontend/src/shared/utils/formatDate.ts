import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};

export const formatRelativeDate = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: ptBR
  });
};