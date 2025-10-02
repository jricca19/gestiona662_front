import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import { establecerPostulaciones } from '../store/slices/postulacionesSlice';
import { establecerTotalPublicaciones } from '../store/slices/publicacionesSlice';
import { URL_BACKEND } from '@env';

const POLL_INTERVAL = 120000; // 2 minutos

const Observador = () => {
    const dispatch = useDispatch();
    const postulaciones = useSelector(state => state.postulaciones.items);
    const publicacionesTotal = useSelector(state => state.publicaciones?.total ?? 0);
    const logueado = useSelector(state => state.usuario.logueado);

    // Guardar los datos previos para comparar
    const prevPostulaciones = useRef(postulaciones);
    const prevTotalPublicaciones = useRef(publicacionesTotal);

    useEffect(() => {
        prevPostulaciones.current = postulaciones;
    }, [postulaciones]);
    useEffect(() => {
        prevTotalPublicaciones.current = publicacionesTotal;
    }, [publicacionesTotal]);

    useEffect(() => {
        if (!logueado) return;

        const interval = setInterval(async () => {
            try {
                const token = await SecureStore.getItemAsync('token');

                // Postulaciones
                const resPost = await fetch(`${URL_BACKEND}/v1/postulations/user`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const dataPost = await resPost.json();
                if (resPost.status === 200) {
                    if (JSON.stringify(dataPost) !== JSON.stringify(prevPostulaciones.current)) {
                        dispatch(establecerPostulaciones(dataPost));
                        const cambios = dataPost.filter((p, i) =>
                            prevPostulaciones.current[i]?._id === p._id &&
                            prevPostulaciones.current[i]?.status !== p.status
                        );
                        if (cambios.length > 0) {
                            await Notifications.scheduleNotificationAsync({
                                content: {
                                    title: '¡Actualización de postulaciones!',
                                    body: 'El estado de una o más postulaciones ha cambiado.',
                                },
                                trigger: null,
                            });
                        }
                    }
                }

                // Publicaciones
                const resPub = await fetch(`${URL_BACKEND}/v1/publications?page=1&limit=1`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const dataPub = await resPub.json();
                if (resPub.status === 200) {
                    dispatch(establecerTotalPublicaciones(dataPub.total));
                    if (dataPub.total > prevTotalPublicaciones.current) {
                        await Notifications.scheduleNotificationAsync({
                            content: {
                                title: '¡Nuevas publicaciones!',
                                body: 'Hay nuevas publicaciones disponibles.',
                            },
                            trigger: null,
                        });
                    }
                }
            } catch (err) {
                console.error('Error al obtener datos:', err);
            }
        }, POLL_INTERVAL);

        return () => clearInterval(interval);
    }, [logueado, dispatch]);

    return null;
};

export default Observador;
