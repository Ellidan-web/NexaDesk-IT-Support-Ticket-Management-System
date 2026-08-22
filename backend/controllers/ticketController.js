const { supabaseAdmin } = require('../config/supabase');

// Create a new ticket
const createTicket = async (req, res) => {
    try {
        const { title, description, category, priority } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!title || !description || !category) {
            return res.status(400).json({
                error: 'Please provide title, description, and category'
            });
        }

        // Create ticket
        const { data: ticket, error } = await supabaseAdmin
            .from('tickets')
            .insert([
                {
                    user_id: userId,
                    title,
                    description,
                    category,
                    priority: priority || 'MEDIUM',
                    status: 'OPEN'
                }
            ])
            .select('*')
            .single();

        if (error) {
            console.error('Create ticket error:', error);
            return res.status(500).json({ error: 'Failed to create ticket' });
        }

        // Add to history
        await supabaseAdmin
            .from('ticket_history')
            .insert([
                {
                    ticket_id: ticket.id,
                    action: 'Ticket created',
                    changed_by: userId
                }
            ]);

        res.status(201).json({
            message: 'Ticket created successfully',
            ticket
        });

    } catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({ error: 'Failed to create ticket' });
    }
};

// Get user's tickets with pagination, search, and sort
const getUserTickets = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;
        const search = req.query.search || '';
        const status = req.query.status || '';
        const priority = req.query.priority || '';
        const sortBy = req.query.sortBy || 'created_at';
        const sortOrder = req.query.sortOrder || 'desc';

        // Build query
        let query = supabaseAdmin
            .from('tickets')
            .select('*', { count: 'exact' })
            .eq('user_id', userId);

        // Add search filter
        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        // Add status filter
        if (status) {
            query = query.eq('status', status);
        }

        // Add priority filter
        if (priority) {
            query = query.eq('priority', priority);
        }

        // Get total count
        const { count, error: countError } = await query;

        if (countError) {
            console.error('Count error:', countError);
            return res.status(500).json({ error: 'Failed to get ticket count' });
        }

        // Get paginated tickets with sorting
        const { data: tickets, error } = await query
            .order(sortBy, { ascending: sortOrder === 'asc' })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Get tickets error:', error);
            return res.status(500).json({ error: 'Failed to get tickets' });
        }

        const totalPages = Math.ceil(count / limit);

        res.json({
            tickets,
            pagination: {
                page,
                limit,
                total: count,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get tickets error:', error);
        res.status(500).json({ error: 'Failed to get tickets' });
    }
};

// Get single ticket with comments
const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Get ticket with user info
        const { data: ticket, error: ticketError } = await supabaseAdmin
            .from('tickets')
            .select(`
                *,
                users:tickets_user_id_fkey (
                    id,
                    name,
                    email
                ),
                assigned_users:tickets_assigned_to_fkey (
                    id,
                    name,
                    email
                )
            `)
            .eq('id', id)
            .single();

        if (ticketError || !ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Check access
        if (ticket.user_id !== userId && userRole !== 'admin' && userRole !== 'staff') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Get comments
        const { data: comments, error: commentsError } = await supabaseAdmin
            .from('comments')
            .select(`
                *,
                users:comments_user_id_fkey (
                    id,
                    name,
                    email
                )
            `)
            .eq('ticket_id', id)
            .order('created_at', { ascending: true });

        if (commentsError) {
            console.error('Get comments error:', commentsError);
        }

        // Get history
        const { data: history, error: historyError } = await supabaseAdmin
            .from('ticket_history')
            .select(`
                *,
                users:ticket_history_changed_by_fkey (
                    id,
                    name,
                    email
                )
            `)
            .eq('ticket_id', id)
            .order('created_at', { ascending: true });

        if (historyError) {
            console.error('Get history error:', historyError);
        }

        res.json({
            ticket,
            comments: comments || [],
            history: history || []
        });

    } catch (error) {
        console.error('Get ticket error:', error);
        res.status(500).json({ error: 'Failed to get ticket' });
    }
};

// Update ticket status
const updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Validate status
        const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        // Get ticket to check access
        const { data: existingTicket, error: getError } = await supabaseAdmin
            .from('tickets')
            .select('user_id, status')
            .eq('id', id)
            .single();

        if (getError || !existingTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Check access (admins can update any, users can only update their own)
        if (existingTicket.user_id !== userId && userRole !== 'admin' && userRole !== 'staff') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Update ticket
        const { data: ticket, error } = await supabaseAdmin
            .from('tickets')
            .update({ status })
            .eq('id', id)
            .select('*')
            .single();

        if (error) {
            console.error('Update ticket error:', error);
            return res.status(500).json({ error: 'Failed to update ticket' });
        }

        // Add to history
        await supabaseAdmin
            .from('ticket_history')
            .insert([
                {
                    ticket_id: id,
                    action: `Status changed from ${existingTicket.status} to ${status}`,
                    changed_by: userId
                }
            ]);

        res.json({
            message: 'Ticket updated successfully',
            ticket
        });

    } catch (error) {
        console.error('Update ticket error:', error);
        res.status(500).json({ error: 'Failed to update ticket' });
    }
};

// Update ticket priority
const updateTicketPriority = async (req, res) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Validate priority
        const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        if (!validPriorities.includes(priority)) {
            return res.status(400).json({ error: 'Invalid priority' });
        }

        // Get ticket to check access
        const { data: existingTicket, error: getError } = await supabaseAdmin
            .from('tickets')
            .select('user_id, priority')
            .eq('id', id)
            .single();

        if (getError || !existingTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Check access (admins can update any, users can only update their own)
        if (existingTicket.user_id !== userId && userRole !== 'admin' && userRole !== 'staff') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Update ticket
        const { data: ticket, error } = await supabaseAdmin
            .from('tickets')
            .update({ priority })
            .eq('id', id)
            .select('*')
            .single();

        if (error) {
            console.error('Update ticket error:', error);
            return res.status(500).json({ error: 'Failed to update ticket' });
        }

        // Add to history
        await supabaseAdmin
            .from('ticket_history')
            .insert([
                {
                    ticket_id: id,
                    action: `Priority changed from ${existingTicket.priority} to ${priority}`,
                    changed_by: userId
                }
            ]);

        res.json({
            message: 'Ticket updated successfully',
            ticket
        });

    } catch (error) {
        console.error('Update ticket error:', error);
        res.status(500).json({ error: 'Failed to update ticket' });
    }
};

// Add comment to ticket
const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (!message) {
            return res.status(400).json({ error: 'Comment message is required' });
        }

        // Check ticket exists and user has access
        const { data: ticket, error: getError } = await supabaseAdmin
            .from('tickets')
            .select('user_id')
            .eq('id', id)
            .single();

        if (getError || !ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Check access (users can comment on their own tickets, admins can comment on all)
        if (ticket.user_id !== userId && userRole !== 'admin' && userRole !== 'staff') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Add comment
        const { data: comment, error } = await supabaseAdmin
            .from('comments')
            .insert([
                {
                    ticket_id: id,
                    user_id: userId,
                    message
                }
            ])
            .select('*, users!user_id(name, email)')
            .single();

        if (error) {
            console.error('Add comment error:', error);
            return res.status(500).json({ error: 'Failed to add comment' });
        }

        // Add to history
        await supabaseAdmin
            .from('ticket_history')
            .insert([
                {
                    ticket_id: id,
                    action: 'Comment added',
                    changed_by: userId
                }
            ]);

        res.status(201).json({
            message: 'Comment added successfully',
            comment
        });

    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

// Admin: Get all tickets with pagination, filters, and sort
const getAllTickets = async (req, res) => {
    try {
        const { status, priority, assignedTo } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'created_at';
        const sortOrder = req.query.sortOrder || 'desc';
        const search = req.query.search || '';

        let query = supabaseAdmin
            .from('tickets')
            .select('*, users!tickets_user_id_fkey(id, name, email), assigned_users:users!tickets_assigned_to_fkey(id, name, email)', { count: 'exact' });

        // Add search filter
        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        // Apply filters
        if (status) {
            query = query.eq('status', status);
        }
        if (priority) {
            query = query.eq('priority', priority);
        }
        if (assignedTo) {
            query = query.eq('assigned_to', assignedTo);
        }

        const { data: tickets, error, count } = await query
            .order(sortBy, { ascending: sortOrder === 'asc' })
            .range(offset, offset + limit - 1);

        if (error) {
            console.error('Get all tickets error:', error);
            return res.status(500).json({ error: 'Failed to get tickets' });
        }

        const totalPages = Math.ceil(count / limit);

        res.json({
            tickets,
            pagination: {
                page,
                limit,
                total: count,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get all tickets error:', error);
        res.status(500).json({ error: 'Failed to get tickets' });
    }
};
// Admin: Assign ticket to user
const assignTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;
        const userId = req.user.id;

        // Check if assigned user exists
        if (assignedTo) {
            const { data: user, error: userError } = await supabaseAdmin
                .from('users')
                .select('id')
                .eq('id', assignedTo)
                .single();

            if (userError || !user) {
                return res.status(404).json({ error: 'User not found' });
            }
        }

        // Get current assignment
        const { data: existingTicket, error: getError } = await supabaseAdmin
            .from('tickets')
            .select('assigned_to')
            .eq('id', id)
            .single();

        if (getError || !existingTicket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Update ticket
        const { data: ticket, error } = await supabaseAdmin
            .from('tickets')
            .update({ assigned_to: assignedTo || null })
            .eq('id', id)
            .select('*')
            .single();

        if (error) {
            console.error('Assign ticket error:', error);
            return res.status(500).json({ error: 'Failed to assign ticket' });
        }

        // Add to history
        const oldAssignee = existingTicket.assigned_to || 'unassigned';
        const newAssignee = assignedTo || 'unassigned';
        await supabaseAdmin
            .from('ticket_history')
            .insert([
                {
                    ticket_id: id,
                    action: `Assigned from ${oldAssignee} to ${newAssignee}`,
                    changed_by: userId
                }
            ]);

        res.json({
            message: 'Ticket assigned successfully',
            ticket
        });

    } catch (error) {
        console.error('Assign ticket error:', error);
        res.status(500).json({ error: 'Failed to assign ticket' });
    }
};

module.exports = {
    createTicket,
    getUserTickets,
    getTicketById,
    updateTicketStatus,
    updateTicketPriority,
    addComment,
    getAllTickets,
    assignTicket
};